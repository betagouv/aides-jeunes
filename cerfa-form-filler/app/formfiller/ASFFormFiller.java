package formfiller;

import models.Situation;

import org.apache.pdfbox.pdmodel.PDDocument;

public class ASFFormFiller extends FormFiller {

    public ASFFormFiller(PDDocument document, Situation situation) {
        super(document, situation);
    }

    @Override
    public void fill() {

    }
}
