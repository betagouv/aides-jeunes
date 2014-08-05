package formfiller;

import models.Situation;

import org.apache.pdfbox.pdmodel.PDDocument;

public class RSAFormFiller extends FormFiller {

    public RSAFormFiller(PDDocument document, Situation situation) {
        super(document, situation);
    }

    @Override
    public void fill() {
    }
}
