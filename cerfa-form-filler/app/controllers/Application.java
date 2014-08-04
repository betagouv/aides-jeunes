package controllers;

import java.io.File;
import java.io.IOException;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.Nationalite;
import models.Situation.StatutMarital;

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
        PDDocument document = PDDocument.load("resources/cmuc.pdf");
        Individu demandeur = createDummyIndividu();
        demandeur.role = IndividuRole.DEMANDEUR;
        Individu conjoint = createDummyIndividu();
        conjoint.role = IndividuRole.CONJOINT;
        conjoint.statutMarital = StatutMarital.MARIAGE;
        Individu enfant = createDummyIndividu();
        enfant.role = IndividuRole.ENFANT;
        Situation situation = new Situation();
        situation.individus.add(demandeur);
        situation.individus.add(conjoint);
        situation.individus.add(enfant);
        situation.individus.add(enfant);
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
        Individu demandeur = createDummyIndividu();
        demandeur.role = IndividuRole.DEMANDEUR;
        Individu conjoint = createDummyIndividu();
        conjoint.role = IndividuRole.CONJOINT;
        conjoint.statutMarital = StatutMarital.MARIAGE;
        Individu enfant = createDummyIndividu();
        enfant.role = IndividuRole.ENFANT;
        Situation situation = new Situation();
        situation.individus.add(demandeur);
        situation.individus.add(conjoint);
        situation.individus.add(enfant);
        situation.individus.add(enfant);
        AspaFormFiller filler = new AspaFormFiller(document, situation);
        filler.fill();
        File file = File.createTempFile("tmp", ".pdf");
        document.save(file);

        Status result = ok(file, true);
        file.delete();

        return result;
    }

    private static Individu createDummyIndividu() {
        Individu individu = new Individu();
        individu.firstName = "Arnaud";
        individu.lastName = "Kleinpeter";
        individu.numeroSecu = "189096748227544";
        individu.dateDeNaissance = "14/09/1989";
        individu.nationalite = Nationalite.FRANCAISE;
        individu.address = "11 rue Pache";
        individu.postalCode = "75011";
        individu.city = "Paris";
        individu.email = "arnaud.kleinpeter@gmail.com";
        individu.phoneNumber = "0685644221";

        return individu;
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
