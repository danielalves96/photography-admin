import React, { useRef } from "react";
import ImageUploading from "react-images-uploading";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";
import "./styles.css";
import { Loader } from "../FullScreenLoader";

export function ImageDropzone() {
  const [images, setImages] = React.useState([]);
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const maxNumber = 69;

  const descriptionRef = useRef();
  const categoryRef = useRef();
  const formatRef = useRef();

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

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

  async function handleSubmit(e) {
    setLoader(true);
    e.preventDefault();
    const lightboxCaption = descriptionRef.current.value;
    const category = categoryRef.current.value;
    const src = images[0].data_url;
    const format = formatRef.current.value;

    if (category === "null" || format === "null") {
      setLoader(false);
      errorModal();
      return;
    }

    const imageData = {
      lightboxCaption,
      category,
      width,
      height,
      src,
    };

    const { data, error } = await supabase.from("pictures").insert(imageData);

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

    console.log(data);

    setImages([]);
  }

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <Loader state={loader} />
            {imageList.length < 1 && (
              <button
                className="button"
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Clique aqui para adicionar uma nova foto
              </button>
            )}
            &nbsp;
            {imageList.map((image, index) => (
              <>
                <div key={index} className="image-container">
                  <img src={image["data_url"]} alt="" className="image-limit" />
                  <div className="image-item__btn-wrapper">
                    <button
                      className="button is-small"
                      onClick={() => onImageUpdate(index)}
                    >
                      Alterar
                    </button>
                    <button
                      className="button is-small"
                      onClick={() => onImageRemove(index)}
                    >
                      Remover
                    </button>
                  </div>
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
                            <option >Fine art</option>
                            <option >Estúdio</option>
                            <option >Ensaios externos</option>
                            <option >Casamentos</option>
                            <option >Pré casamento</option>
                            <option >Teatro</option>
                            <option >15 Anos</option>
                            <option >Gastronomia</option>
                            <option >Infantil</option>
                            <option >Comercial</option>
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
                          <select
                            required
                            ref={formatRef}
                            onChange={onSelectFormat}
                          >
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
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
