import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const GameUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const submit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `https://${import.meta.env.VITE_HOST_IP}:5000/api/v2/game/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const json = await response.json();

    console.log(json);
  };

  return (
    <>
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        name="gameFolder"
      />
      <Button onClick={() => submit()}>Send</Button>
    </>
  );
};

export default GameUpload;
