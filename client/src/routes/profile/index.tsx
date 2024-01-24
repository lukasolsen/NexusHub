import { useParams } from "@tanstack/react-router";

const ProfileRouteToken: React.FC = () => {
  const { profileId }: { profileId: string } = useParams({ strict: false });

  return (
    <>
      <h1>Hello</h1>
      <h1>{profileId}</h1>
    </>
  );
};

export default ProfileRouteToken;
