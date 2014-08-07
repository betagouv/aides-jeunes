package pdfwriter;

import java.io.IOException;

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

public class PdfWriter {

    private static final PDFont FONT = PDType1Font.TIMES_ROMAN;

    private PDDocument document;
    private PDAcroForm form;
    private int page = -1;
    private PDPageContentStream contentStream;
    private int fontSize = 12;
    private float numberSpacing = 12;

    public PdfWriter(PDDocument document) {
        this.document = document;
    }

    public void setPage(int page) {
        if (this.page == page) {
            return;
        }

        this.page = page;

        try {
            flush();
            PDPage pdPage = (PDPage) document.getDocumentCatalog().getAllPages().get(page);
            contentStream = new PDPageContentStream(document, pdPage, true, true, true);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void flush() {
        if (null != contentStream) {
            try {
                contentStream.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void setFontSize(int fontSize) {
        this.fontSize = fontSize;
    }

    public void setNumberSpacing(float numberSpacing) {
        this.numberSpacing = numberSpacing;
    }

    public void appendText(String text, float x, float y, int fontSize) {
        try {
            contentStream.beginText();
            contentStream.setFont(FONT, fontSize);
            contentStream.moveTextPositionByAmount(x, y);
            contentStream.drawString(text.toUpperCase());
            contentStream.endText();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void appendText(String text, float x, float y) {
        appendText(text, x, y, this.fontSize);
    }

    public void appendOptionalText(String text, float x, float y, int fontSize) {
        if (null != text) {
            appendText(text, x, y, fontSize);
        }
    }

    public void appendOptionalText(String text, float x, float y) {
        appendOptionalText(text, x, y, this.fontSize);
    }

    public void appendNumber(String number, float x, float y, int fontSize) {
        for (int i = 0; i < number.length(); i++) {
            appendText(number.substring(i, i + 1), x + i * numberSpacing, y, fontSize);
        }
    }

    public void appendNumber(String number, float x, float y) {
        appendNumber(number, x, y, this.fontSize);
    }

    public void appendOptionalNumber(String number, float x, float y) {
        if (null != number) {
            appendNumber(number, x, y);
        }
    }

    public void appendDate(String date, float x, float y) {
        appendNumber(date.replaceAll("/", ""), x, y);
    }

    public void checkbox(float x, float y) {
        appendText("x", x, y);
    }

    public void initAcroForm() {
        this.form = this.document.getDocumentCatalog().getAcroForm();
    }

    public void fillTextField(String fieldName, String fieldValue) {
        PDTextbox field;
        try {
            field = (PDTextbox) form.getField(fieldName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        if (null == field) {
            throw new RuntimeException(String.format("Le champ %s n'existe pas dans le formulaire", fieldName));
        }

        COSDictionary dictionary = (COSDictionary) field.getCOSObject();
        dictionary.setItem(COSName.V, new COSString(fieldValue.toUpperCase()));
    }

    public void fillOptionalTextField(String fieldName, String fieldValue) {
        if (null != fieldValue) {
            fillTextField(fieldName, fieldValue);
        }
    }

    public void fillDateField(String fieldName, String fieldValue) {
        fillTextField(fieldName, fieldValue.replaceAll("/", ""));
    }

    public void fillRadioField(String fieldName, String value) {
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
}
