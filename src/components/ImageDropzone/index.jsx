import React, { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import "./styles.css";
import { Loader } from "../FullScreenLoader";
import { v4 as uuidv4 } from 'uuid';

export function ImageDropzone() {
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [foto, setFoto] = React.useState([]);

  const descriptionRef = useRef();
  const categoryRef = useRef();
  const formatRef = useRef();

  const onSelectFormat = (e) => {
    e.preventDefault();
    const format = formatRef.current.value;

    if (format === `landscape`) {
      setWidth("4");
      setHeight("3");
      return;
    }

    if (format === `portrait`) {
      setWidth("3");
      setHeight("4");
      return;
    }

    if (format === `square`) {
      setWidth("1");
      setHeight("1");
      return;
    }
  };

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
    setFoto(files[0]);
  };

  async function handleSubmit(e) {
    setLoader(true);
    e.preventDefault();
    const lightboxCaption = descriptionRef.current.value;
    const category = categoryRef.current.value;
    const format = formatRef.current.value;

    if (category === "null" || format === "null") {
      setLoader(false);
      errorModal();
      return;
    }

    const imageBucketName = uuidv4();

    const { data, error } = await supabase.storage
      .from("pictures")
      .upload(`${imageBucketName}.jpg`, foto);

    if (data) {
      const { signedURL, error } = await supabase.storage
        .from("pictures")
        .createSignedUrl(`${imageBucketName}.jpg`, 60);

      if (signedURL) {
        const imageData = {
          lightboxCaption,
          category,
          width,
          height,
          src: signedURL,
        };

        const { data, error } = await supabase
          .from("pictures")
          .insert(imageData);
        if (data) {
          setLoader(false);
          Swal.fire({
            title: "Feito!",
            text: "Upload realizado com sucesso!",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "#3e8ed0",
          });
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
      {/* <img src={picPreview} alt="" width="400" /> */}

      <>
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
          <input
            className="input mb-5"
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={handleFileSelected}
          />
          <form className="form" onSubmit={handleSubmit}>
            <div class="field">
              <label for="" class="label">
                Descrição
              </label>
              <div class="control ">
                <input
                  type="text"
                  placeholder="Digite uma descrição curta"
                  class="input"
                  required
                  ref={descriptionRef}
                />
              </div>
            </div>
            <div class="field">
              <label for="" class="label">
                Categoria
              </label>
              <div class="control ">
                <div class="select">
                  <select required ref={categoryRef}>
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
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <label for="" class="label">
                Formato
              </label>
              <div class="control ">
                <div class="select">
                  <select required ref={formatRef} onChange={onSelectFormat}>
                    <option value="null">Selecione</option>
                    <option value="landscape">Paisagem</option>
                    <option value="portrait">Retrato</option>
                    <option valuer="square">Quadrado</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field mt-5 mb-5">
              <button class="button is-info">Publicar foto</button>
            </div>
          </form>
        </div>
      </>
      <Loader state={loader} />
    </div>
  );
}
