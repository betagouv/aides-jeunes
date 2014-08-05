package formfiller;

import java.io.IOException;

import models.Situation;

import org.apache.pdfbox.cos.COSDictionary;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.cos.COSString;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.edit.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDCheckbox;
import org.apache.pdfbox.pdmodel.interactive.form.PDRadioCollection;
import org.apache.pdfbox.pdmodel.interactive.form.PDTextbox;

public abstract class FormFiller {

    private static final PDFont FONT = PDType1Font.TIMES_ROMAN;

    protected final PDDocument document;
    protected final PDAcroForm form;
    protected final Situation situation;
    protected int currentPage = 0;

    public FormFiller(PDDocument document, Situation situation) {
        this.document = document;
        this.form = document.getDocumentCatalog().getAcroForm();
        this.situation = situation;
    }

    public abstract void fill();

    protected void fillTextField(String fieldName, String fieldValue) {
        PDTextbox field;
        try {
            field = (PDTextbox) form.getField(fieldName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        COSDictionary dictionary = (COSDictionary) field.getCOSObject();
        dictionary.setItem(COSName.V, new COSString(fieldValue.toUpperCase()));
    }

    protected void fillOptionalTextField(String fieldName, String fieldValue) {
        if (null != fieldValue) {
            fillTextField(fieldName, fieldValue);
        }
    }

    protected void fillDateField(String fieldName, String fieldValue) {
        fillTextField(fieldName, fieldValue.replaceAll("/", ""));
    }

    protected void fillRadioField(String fieldName, String value) {
        try {
            PDRadioCollection field = (PDRadioCollection) form.getField(fieldName);
            for (Object object : field.getKids()) {
                PDCheckbox checkbox = (PDCheckbox) object;
                if (checkbox.getOnValue().equals(value)) {
                    checkbox.check();
                    return;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        throw new RuntimeException(String.format("Le champ radio \"%s\" n'a pas de valeur \"%s\" sélectionnable", fieldName, value));
    }

    protected void appendText(String text, float x, float y, float fontSize) {
        PDPage page = (PDPage) document.getDocumentCatalog().getAllPages().get(currentPage);
        PDPageContentStream contentStream;
        try {
            contentStream = new PDPageContentStream(document, page, true, true);
            contentStream.beginText();
            contentStream.setFont(FONT, fontSize);
            contentStream.moveTextPositionByAmount(x, y);
            contentStream.drawString(text.toUpperCase());
            contentStream.endText();
            contentStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    protected void appendText(String text, float x, float y) {
        appendText(text, x, y, 12);
    }

    protected void appendOptionalText(String text, float x, float y) {
        if (null != text) {
            appendText(text, x, y);
        }
    }

    protected void appendNumber(String number, float x, float y) {
        for (int i = 0; i < number.length(); i++) {
            appendText(number.substring(i, i+1), x + i * getNumberSpacing(), y);
        }
    }

    protected float getNumberSpacing() {
        return 12;
    }

    protected void appendDate(String date, float x, float y) {
        appendNumber(date.replaceAll("/", ""), x, y);
    }

    protected void checkbox(float x, float y) {
        appendText("x", x, y);
    }

    protected static class Point {

        public final float x;
        public final float y;

        public Point(float x, float y) {
            this.x = x;
            this.y = y;
        }
    }
}
