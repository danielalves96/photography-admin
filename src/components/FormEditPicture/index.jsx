import React, { useRef, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import "./styles.css";
import { Loader } from "../FullScreenLoader";

export function FormEditPicture(props) {
  const [loader, setLoader] = React.useState(false);

  const descriptionRef = useRef();
  const categoryRef = useRef();

  const errorModal = () => {
    return Swal.fire({
      title: "Opss!",
      text: "Preencha todos os campos para atualizar.",
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#3e8ed0",
    });
  };

  async function handleSubmit(e) {
    setLoader(true);
    e.preventDefault();
    const title = descriptionRef.current.value;
    const category = categoryRef.current.value;

    if (category === "null") {
      setLoader(false);
      errorModal();
      return;
    }

    const imageData = {
      id: props.id,
      title,
      category,
    };

    const { data, error } = await supabase.from("pictures").upsert(imageData);

    if (data) {
      setLoader(false);
      Swal.fire({
        title: "Feito!",
        text: "Atualização realizada com sucesso!",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3e8ed0",
      });

      props.setIsEditing(false);
      props.reloadPage(!props.pageReloader);
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

    console.log(data);
  }

  return (
    <div className="App">
      <>
        <h1>Editar foto</h1>
        <div className="image-container">
          <img src={props.src} alt="" className="image-limit" />
        </div>
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
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
                  defaultValue={props.title}
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
                  <select
                    required
                    ref={categoryRef}
                    defaultValue={props.category}
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
                  </select>
                </div>
              </div>
            </div>
            <div class="field mt-5 mb-5 gap-20">
              <a
                onClick={() => {
                  props.setIsEditing(false);
                }}
                class="button is-danger"
              >
                Cancelar
              </a>
              <button class="button is-info">Salvar</button>
            </div>
          </form>
        </div>
      </>
      <Loader state={loader} />
    </div>
  );
}
