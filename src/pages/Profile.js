import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Profile = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aqui você verá as informações do seu perfil (em desenvolvimento).</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

