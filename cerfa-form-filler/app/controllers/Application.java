package controllers;

import java.io.File;
import java.io.IOException;

import models.Situation;

import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;

import pdfwriter.PdfWriter;
import play.Logger;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;
import actions.AddAccessControlHeadersAction;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import formfiller.ASFFormFiller;
import formfiller.AspaFormFiller;
import formfiller.CAFFormFiller;
import formfiller.CmuFormFiller;
import formfiller.FormFiller;
import formfiller.RSAFormFiller;

@With(AddAccessControlHeadersAction.class)
public class Application extends Controller {

    protected static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    static {
        JSON_MAPPER.setSerializationInclusion(Include.NON_NULL);
        JSON_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static Result options(String options) {
        return ok();
    }

    @BodyParser.Of(BodyParser.Json.class)
    public static Result generate(String formId) throws IOException, COSVisitorException {
        Forms form = getForm(formId);
        if (null == form) {
            String filename = String.format("resources/%s.pdf", formId);
            File file = new File(filename);
            if (file.exists()) {
                return ok(file, filename);
            }

            return badRequest(String.format("Formulaire inconnu : %s", formId));
        }

        Logger.info(String.format("Génération formulaire %s", formId));

        FormFiller filler = createFormFiller(form);
        Situation situation = getRequest(Situation.class);
        filler.setSituation(situation);
        filler.fill();

        File file = File.createTempFile("tmp", ".pdf");
        try {
            filler.getWriter().save(file);

            return ok(file, formId.concat(".pdf"));
        } finally {
            file.delete();
        }
    }

    public static Result generateFake(String formId) throws IOException, COSVisitorException {
        Forms form = getForm(formId);
        if (null == form) {
            return badRequest(String.format("Formulaire inconnu : %s", formId));
        }

        FormFiller filler = createFormFiller(form);
        filler.fillFake();

        File file = File.createTempFile("tmp", ".pdf");
        try {
            filler.getWriter().save(file);

            return ok(file, formId.concat(".pdf"));
        } finally {
            file.delete();
        }
    }

    private static Forms getForm(String formId) {
        for (Forms val : Forms.values()) {
            if (val.id.equals(formId)) {
                return val;
            }
        }

        return null;
    }

    private static FormFiller createFormFiller(Forms form) throws IOException {
        FormFiller filler = form.createFormFiller();
        PDDocument document = PDDocument.load(String.format("resources/%s.pdf", form.id));
        filler.setWriter(new PdfWriter(document));

        return filler;
    }

    public static enum Forms {

        CMUC("cmuc_demande") {

            @Override
            public FormFiller createFormFiller() {
                return new CmuFormFiller();
            }
        },
        ASPA("aspa") {

            @Override
            public FormFiller createFormFiller() {
                return new AspaFormFiller();
            }
        },
        CAF_DECLARATION_SITUATION("caf_declaration_situation") {

            @Override
            public FormFiller createFormFiller() {
                return new CAFFormFiller();
            }
        },
        RSA("rsa_demande") {

            @Override
            public FormFiller createFormFiller() {
                return new RSAFormFiller();
            }
        },
        ASF("asf") {

            @Override
            public FormFiller createFormFiller() {
                return new ASFFormFiller();
            }
        };

        public final String id;

        Forms(String id) {
            this.id = id;
        }

        public abstract FormFiller createFormFiller();
    }

    protected static <T> T getRequest(Class<T> requestClass) {
        JsonNode json = request().body().asJson();
        JsonFactory factory = JSON_MAPPER.getFactory();

        try {
            JsonParser jsonParser = factory.createParser(json.toString());

            return JSON_MAPPER.readValue(jsonParser, requestClass);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
