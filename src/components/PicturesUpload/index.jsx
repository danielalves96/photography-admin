import { FaUpload } from "react-icons/fa";
import { ImageDropzone } from "../ImageDropzone";

export function PicturesUpload() {
  return (
    <div className="card">
      <div className="card-header">
        <p className="card-header-title">
          <FaUpload /> &nbsp; Upload de fotos
        </p>
      </div>
      <div className="card-content">
        <div className="content">
          <ImageDropzone/>
        </div>
      </div>
    </div>
  );
}
