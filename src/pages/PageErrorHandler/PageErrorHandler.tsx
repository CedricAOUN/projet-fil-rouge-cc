import NotFound from "../NotFound/NotFound";
import ServerError from "../ServerError/ServerError";
import Unauthenticated from "../Unauthenticated/Unauthenticated";
import Unauthorized from "../Unauthorized/Unauthorized";

const PageErrorHandler = ({ errorStatus }: { errorStatus?: number }) => {
  switch (errorStatus) {
    case 404:
      return <NotFound />;
    case 401:
      return <Unauthenticated />;
    case 403:
      return <Unauthorized />;
    case 500:
      return <ServerError />
    default:
      return <NotFound />;
  }
}

export default PageErrorHandler