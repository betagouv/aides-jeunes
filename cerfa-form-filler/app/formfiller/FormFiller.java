package formfiller;

import java.io.IOException;

import org.apache.pdfbox.cos.COSDictionary;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.cos.COSString;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDCheckbox;
import org.apache.pdfbox.pdmodel.interactive.form.PDRadioCollection;
import org.apache.pdfbox.pdmodel.interactive.form.PDTextbox;

public abstract class FormFiller {

    protected final PDAcroForm form;
    protected final PDDocument document;

    public FormFiller(PDDocument document) {
        this.document = document;
        this.form = document.getDocumentCatalog().getAcroForm();
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
}
