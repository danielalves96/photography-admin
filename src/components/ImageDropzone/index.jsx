import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import "./styles.css";
import { Loader } from "../FullScreenLoader";
import { v4 as uuidv4 } from "uuid";

export function ImageDropzone() {
  const [loader, setLoader] = React.useState(false);
  const [foto, setFoto] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState();
  const [category, setCategory] = React.useState(null);
  const [description, setDescription] = React.useState(null);

  const descriptionRef = useRef();
  const categoryRef = useRef();
  const history = useHistory();

  const errorModal = () => {
    return Swal.fire({
      title: "Opss!",
      text: "Preencha todos os campos para fazer o upload.",
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#3e8ed0",
    });
  };

  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);

    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }

    setFoto(files[0]);
  };

  async function handleSubmit(e) {
    setLoader(true);
    e.preventDefault();
    const lightboxCaption = descriptionRef.current.value;
    const category = categoryRef.current.value;

    if (category === "null") {
      setLoader(false);
      errorModal();
      return;
    }

    const imageBucketName = uuidv4();

    const { data, error } = await supabase.storage
      .from("pictures")
      .upload(`${imageBucketName}.jpg`, foto);

    if (data) {
      const { publicURL, error } = await supabase.storage
        .from("pictures")
        .getPublicUrl(`${imageBucketName}.jpg`);

      console.log(publicURL);

      if (publicURL) {
        const imageData = {
          lightboxCaption,
          category,
          src: publicURL,
        };

        const { data, error } = await supabase
          .from("pictures")
          .insert(imageData);
        if (data) {
          setLoader(false);
          await Swal.fire({
            title: "Feito!",
            text: "Upload realizado com sucesso!",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3e8ed0",
          });
          history.go(0);
          setCategory("");
          setDescription("");
        }

        if (error) {
          setLoader(false);
          Swal.fire({
            title: "Opss!",
            text: "Algo deu errado, tente novamente.",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3e8ed0",
          });
        }
      }
    }
  }

  return (
    <div className="App">
      <>
        {selectedImage && (
          <div className="align-image">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Thumb"
              width={600}
            />
          </div>
        )}
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <input
                className=" mb-5 input is-info"
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={handleFileSelected}
                required
                width="100%"
              />
            </div>
            {selectedImage && (
              <>
                <div className="field">
                  <label for="" className="label">
                    Descrição
                  </label>
                  <div className="control ">
                    <input
                      type="text"
                      placeholder="Digite uma descrição curta"
                      className="input"
                      required
                      ref={descriptionRef}
                      defaultValue={description}
                    />
                  </div>
                </div>
                <div className="field">
                  <label for="" className="label">
                    Categoria
                  </label>
                  <div className="control ">
                    <div className="select">
                      <select
                        required
                        ref={categoryRef}
                        defaultValue={category}
                      >
                        <option value="null">Selecione</option>
                        <option>Fine art</option>
                        <option>Estúdio</option>
                        <option>Ensaios externos</option>
                        <option>Casamentos</option>
                        <option>Pré casamento</option>
                        <option>Teatro</option>
                        <option>15 Anos</option>
                        <option>Gastronomia</option>
                        <option>Infantil</option>
                        <option>Comercial</option>
                        <option>Gestante</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field mt-5 mb-5">
                  <button className="button is-info">Publicar foto</button>
                </div>
              </>
            )}
          </form>
        </div>
      </>
      <Loader state={loader} />
    </div>
  );
}
