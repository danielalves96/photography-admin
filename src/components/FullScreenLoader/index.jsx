import { TailSpin } from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./styles.css";

export function Loader(props) {
  return (
    <>
      {props.state === true && (
        <div className="full-screen-loader">
          <TailSpin
            height="100"
            width="100"
            color="white"
            ariaLabel="loading"
          />
        </div>
      )}
    </>
  );
}
