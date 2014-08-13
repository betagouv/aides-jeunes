package formfiller;

import models.Situation;
import pdfwriter.PdfWriter;

public abstract class FormFiller {

    protected PdfWriter writer;
    protected Situation situation;

    public void setWriter(PdfWriter writer) {
        this.writer = writer;
    }

    public void setSituation(Situation situation) {
        this.situation = situation;
    }

    public Object[][] getCheckboxes() {
        return new Object[][]{};
    }

    public Object[][] getTextFields() {
        return new Object[][]{};
    }

    public abstract void fill();

    public void fillFake() {
        for (Object[] checkbox : getCheckboxes()) {
            int page = (int) checkbox[1];
            float x = checkbox[2] instanceof Float ? (float) checkbox[2] : ((Integer) checkbox[2]).floatValue();
            float y = checkbox[3] instanceof Float ? (float) checkbox[3] : ((Integer) checkbox[3]).floatValue();
            writer.setPage(page);
            writer.checkbox(x, y);
            writer.appendText((String) checkbox[0], x, y + 10, 5);
        }

        for (Object[] textField : getTextFields()) {
            int page = (int) textField[1];
            float x = textField[2] instanceof Float ? (float) textField[2] : ((Integer) textField[2]).floatValue();
            float y = textField[3] instanceof Float ? (float) textField[3] : ((Integer) textField[3]).floatValue();
            int fontSize = 9;
            if (textField.length >= 5) {
                fontSize = (Integer) textField[4];
            }
            writer.setPage(page);
            writer.appendText((String) textField[0], x, y, fontSize);
        }
    }

    protected void checkbox(String checkboxName) {
        for (Object[] checkbox : getCheckboxes()) {
            if (checkboxName.equals(checkbox[0])) {
                int page = (int) checkbox[1];
                float x = checkbox[2] instanceof Float ? (float) checkbox[2] : ((Integer) checkbox[2]).floatValue();
                float y = checkbox[3] instanceof Float ? (float) checkbox[3] : ((Integer) checkbox[3]).floatValue();
                writer.setPage(page);
                writer.checkbox(x, y);

                return;
            }
        }

        throw new RuntimeException(String.format("Checkbox inexistante : \"%s\"", checkboxName));
    }

    protected void appendText(String textFieldName, String textValue) {
        for (Object[] textField : getTextFields()) {
            if (textFieldName.equals(textField[0])) {
                int page = (int) textField[1];
                float x = textField[2] instanceof Float ? (float) textField[2] : ((Integer) textField[2]).floatValue();
                float y = textField[3] instanceof Float ? (float) textField[3] : ((Integer) textField[3]).floatValue();
                writer.setPage(page);

                if (textField.length >= 5) {
                    writer.appendOptionalText(textValue, x, y, (Integer) textField[4]);
                } else {
                    writer.appendOptionalText(textValue, x, y);
                }

                return;
            }
        }

        throw new RuntimeException(String.format("Champ texte inexistant : \"%s\"", textFieldName));
    }
}
