import { useState } from "react";
import { useHistory } from "react-router";
import { Pictures } from "../../components/Pictures";
import { PicturesUpload } from "../../components/PicturesUpload";
import { Sidebar } from "../../components/Sidebar";
import { Texts } from "../../components/Texts";
import { useAuth } from "../../contexts/Auth";

export function Dashboard() {
  const { user, signOut } = useAuth();
  const history = useHistory();
  const [category, setCategory] = useState(`pictures`);

  async function handleSignOut() {
    await signOut();
    history.push("/login");
  }

  return (
    <>
      <section className="main-content columns is-fullheight">
        <Sidebar
          category={category}
          setCategory={setCategory}
          handleSignOut={handleSignOut}
        />

        <div className="container is-fluid column is-10">
          <div className="section">
            {category === "pictures" && <Pictures />}
            {category === "upload" && <PicturesUpload />}
            {category === "texts" && <Texts />}
          </div>
        </div>
      </section>
    </>
  );
}
