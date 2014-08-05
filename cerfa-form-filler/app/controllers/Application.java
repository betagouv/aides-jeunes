package controllers;

import java.io.File;
import java.io.IOException;

import models.Situation;

import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;

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

import formfiller.AspaFormFiller;
import formfiller.CAFFormFiller;
import formfiller.CmuFormFiller;

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
    public static Result cmu() throws COSVisitorException, IOException {
        Logger.info("Génération formulaire CMU");
        Logger.info(request().body().toString());
        PDDocument document = PDDocument.load("resources/cmuc.pdf");
        Situation situation = getRequest(Situation.class);
        CmuFormFiller filler = new CmuFormFiller(document, situation);
        filler.fill();
        File file = File.createTempFile("tmp", ".pdf");
        document.save(file);

        Status result = ok(file, true);
        file.delete();

        return result;
    }

    @BodyParser.Of(BodyParser.Json.class)
    public static Result aspa() throws IOException, COSVisitorException {
        Logger.info("Génération formulaire ASPA");
        PDDocument document = PDDocument.load("resources/aspa.pdf");
        Situation situation = getRequest(Situation.class);
        AspaFormFiller filler = new AspaFormFiller(document, situation);
        filler.fill();
        File file = File.createTempFile("tmp", ".pdf");
        document.save(file);

        Status result = ok(file, true);
        file.delete();

        return result;
    }

    @BodyParser.Of(BodyParser.Json.class)
    public static Result caf() throws IOException, COSVisitorException {
        Logger.info("Génération formulaire CAF");
        PDDocument document = PDDocument.load("resources/caf.pdf");
        Situation situation = getRequest(Situation.class);
        CAFFormFiller filler = new CAFFormFiller(document, situation);
        filler.fill();
        File file = File.createTempFile("tmp", ".pdf");
        document.save(file);

        Status result = ok(file, true);
        file.delete();

        return result;
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
