package formfiller;

import models.Situation;
import pdfwriter.PdfWriter;

public abstract class FormFiller {

    protected final PdfWriter writer;
    protected final Situation situation;

    public FormFiller(PdfWriter writer, Situation situation) {
        this.writer = writer;
        this.situation = situation;
    }

    public abstract void fill();

    protected static class Point {

        public final float x;
        public final float y;

        public Point(float x, float y) {
            this.x = x;
            this.y = y;
        }
    }
}
