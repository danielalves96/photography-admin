import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import Swal from "sweetalert2";

import { useAuth } from "../../contexts/Auth";

export function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState(null);

  const { signIn } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const { error } = await signIn({ email, password });

    if (error) {
      Swal.fire({
        title: "Erro!",
        text: "Credenciais de login inválidas, tente novamente.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3e8ed0"
      });

      setError(error);
    }

    history.push("/");
  }

  return (
    <>
      <section class="hero is-info is-fullheight">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-centered">
              <div class="column is-5-tablet is-4-desktop is-3-widescreen">
                <form onSubmit={handleSubmit} class="box">
                  <img src={logo} alt="" className="mb-3" />
                  <div class="field">
                    <label for="" class="label">
                      Email
                    </label>
                    <div class="control has-icons-left">
                      <input
                        type="email"
                        placeholder="bobsmith@gmail.com"
                        class="input"
                        required
                        id="input-email"
                        ref={emailRef}
                      />
                      <span class="icon is-small is-left">
                        <FaEnvelope />
                      </span>
                    </div>
                  </div>
                  <div class="field">
                    <label for="" class="label">
                      Senha
                    </label>
                    <div class="control has-icons-left">
                      <input
                        type="password"
                        placeholder="*******"
                        class="input"
                        required
                        id="input-password"
                        ref={passwordRef}
                      />
                      <span class="icon is-small is-left">
                        <FaLock />
                      </span>
                    </div>
                  </div>
                  <div class="field mt-5 ">
                    <button class="button is-info">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
