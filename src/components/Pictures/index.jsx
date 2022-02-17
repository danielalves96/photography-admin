import { useEffect, useState } from "react";
import { FaCamera, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import { FormEditPicture } from "../FormEditPicture";
import { Loader } from "../FullScreenLoader";

export function Pictures() {
  const [pics, setPics] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageReloader, reloadPage] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPhotoData, setEditingPhotoData] = useState([]);

  useEffect(() => {
    getPictures();
  }, [pageReloader]);

  async function getPictures() {
    setLoader(true);
    const { data, error } = await supabase
      .from("pictures")
      .select()
      .order("id", { ascending: false });

    if (data) {
      setPics(data);
      setLoader(false);
      console.log(data);
    }
  }

  async function DeletePic(id) {
    setLoader(true);
    const { data, error } = await supabase
      .from("pictures")
      .delete()
      .match({ id: id });

    if (data) {
      setLoader(false);
      reloadPage(!pageReloader);
      Swal.fire({
        title: "Feito!",
        text: "Imagem excluída com sucesso!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3e8ed0",
      });
    }
  }

  async function editPhoto(pic) {
    setIsEditing(true);
    setEditingPhotoData(pic);
    return;
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">
            <FaCamera /> &nbsp; Fotos
          </p>
        </div>
        <div className="card-content">
          <div className="content">
            {!isEditing && (
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <span title="picture">Foto</span>
                    </th>
                    <th>
                      <span title="description">Descrição</span>
                    </th>
                    <th>
                      <span title="category">Categoria</span>
                    </th>
                    <th>
                      <span title="format">Formato</span>
                    </th>
                    <th>
                      <span title="controls">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pics.map((pic) => (
                    <tr key={pic.id}>
                      <td style={{ width: 200 }}>
                        <img src={pic.base64} alt="" width={150} />
                      </td>
                      <td>
                        <span>{pic.title}</span>
                      </td>
                      <td>
                        <span>{pic.category}</span>
                      </td>
                      <td>
                        <span>{pic.width === "4" ? `Paisagem` : ""}</span>
                        <span>{pic.width === "3" ? `Retrato` : ""}</span>
                        <span>{pic.width === "1" ? `Quadrada` : ""}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "20px" }}>
                          <a
                            className="button is-warning"
                            onClick={() => {
                              editPhoto(pic);
                            }}
                          >
                            <FaEdit /> &nbsp; Editar
                          </a>
                          <button
                            className="button is-danger"
                            onClick={() => {
                              DeletePic(pic.id);
                            }}
                          >
                            <FaTrash /> &nbsp; Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {isEditing && (
              <FormEditPicture
                id={editingPhotoData.id}
                base64={editingPhotoData.base64}
                setIsEditing={setIsEditing}
                title={editingPhotoData.title}
                category={editingPhotoData.category}
                format={editingPhotoData.format}
                reloadPage={reloadPage}
                pageReloader={pageReloader}
              />
            )}
          </div>
        </div>
      </div>
      <Loader state={loader} />
    </>
  );
}
