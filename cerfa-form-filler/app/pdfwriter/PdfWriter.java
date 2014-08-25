package pdfwriter;

import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.edit.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

public class PdfWriter {

    private static final PDFont FONT = PDType1Font.TIMES_ROMAN;

    private PDDocument document;
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

    public void appendNumber(String number, float x, float y) {
        for (int i = 0; i < number.length(); i++) {
            appendText(number.substring(i, i + 1), x + i * numberSpacing, y, fontSize);
        }
    }

    public void checkbox(float x, float y) {
        appendText("x", x, y);
    }

    public void save(File file) {
        flush();
        try {
            document.save(file);
        } catch (IOException|COSVisitorException e) {
            throw new RuntimeException(e);
        }
    }
}
