package actions;

import play.libs.F.Promise;
import play.mvc.Http;

public class AddAccessControlHeadersAction extends play.mvc.Action.Simple {

    public static void addAccessControlHeaders(Http.Response response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
        response.setHeader(
                "Access-Control-Allow-Headers",
                "x-requested-with, x-prototype-version, x-json, accept, origin, content-type, api_key, authorization");
    }

    @Override
    public Promise<play.mvc.Result> call(Http.Context ctx) throws Throwable {
        addAccessControlHeaders(ctx.response());
        return delegate.call(ctx);
    }
}
