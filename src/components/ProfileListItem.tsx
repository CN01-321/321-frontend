import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

type ProfileListItemProps = {
  title: string;
  description?: string;
  icon?: IconSource
}

const ProfileListItem = ({
  title,
  description,
  icon,
}: ProfileListItemProps) => {
  return (
    <List.Item
      title={title}
      titleStyle={styles.titleStyle}
      description={description}
      descriptionStyle={styles.descriptionStyle}
      left={props => icon ? <List.Icon {...props} icon={icon} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "#000000",
    fontFamily: "Montserrat-SemiBold",
  },
  descriptionStyle: {
    color: "#000000",
    fontFamily: "Montserrat-Regular",
  },
});
 
export default ProfileListItem;