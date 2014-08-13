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
}
