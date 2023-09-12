import { ScrollView } from "react-native";
import Header from "../../../components/Header";
import { Pet } from "../../../types";
import EditPetForm from "../../../components/EditPetForm";

type EditPetProp = {
  pet: Pet;
}

const EditPet = ({ pet }: EditPetProp) => {
  return (
    <ScrollView>
      <Header title="Edit Profile" />
      <EditPetForm pet={pet} />
    </ScrollView>
  );
}
 
export default EditPet;