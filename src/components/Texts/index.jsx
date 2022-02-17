import { FaFileSignature } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import { Loader } from "../FullScreenLoader";

export function Texts() {
  const [loader, setLoader] = useState(true);
  const [edit, setEdit] = useState("false");
  const [bio, setBio] = useState("");

  const biographyRef = useRef();

  useEffect(() => {
    getBiography();
  }, []);

  async function getBiography() {
    setLoader(true);
    const { data, error } = await supabase.from("biography").select();

    if (data) {
      setLoader(false);
      setBio(data[0].biography);
    }
  }

  async function setBiography(e) {
    setLoader(true);
    e.preventDefault();
    const biography = biographyRef.current.value;
    

    const imageData = {
      id: 1,
      biography,
    };

    const { data, error } = await supabase.from("biography").upsert(imageData);

    if (data) {
      setLoader(false);
      Swal.fire({
        title: "Feito!",
        text: "Atualização realizada com sucesso!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3e8ed0",
      });

      setEdit("false");
      getBiography()
    }

    if (error) {
      setLoader(false);
      setEdit("false");
      Swal.fire({
        title: "Opss!",
        text: "Algo deu errado, tente novamente.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3e8ed0",
      });
    }
  }
  return (
    <div className="card">
      <div className="card-header">
        <p className="card-header-title">
          <FaFileSignature /> &nbsp; Textos
        </p>
      </div>
      <div className="card-content">
        <h1>Biografia</h1>
        <br />
        {edit === "false" && (
          <>
            <div className="content">{bio}</div>
            <div className="content">
              <button
                className="button is-info"
                onClick={() => {
                  setEdit("true");
                }}
              >
                <FaEdit /> &nbsp; Editar
              </button>
            </div>
          </>
        )}
        {edit === "true" && (
          <>
            <textarea defaultValue={bio} className="textarea" ref={biographyRef} />
            <div className="content">
              <button className="button is-info mt-4" onClick={setBiography}>
                <FaEdit /> &nbsp; Salvar
              </button>
            </div>
          </>
        )}
      </div>

      <Loader state={loader} />
    </div>
  );
}
