import React, { Component } from "react";
import { Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";
import { Platform } from "react-native";
class UploadImage extends Component {
  state = {
    image: null
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
    console.log("hi");
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log("Image Result==>" + JSON.stringify(result));

    if (!result.cancelled) {
      this.setState({ image: result.uri });

      const formData = new FormData();
      formData.append("avatar", {
        type: "image/jpeg",
        name: "image.jpeg",
        uri: result.uri
      });
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type":
            'multipart/form-data; charset=utf-8; boundary="another cool boundary";'
        }
      };

      axios
        .post("http://192.168.0.100/upload/upload.php", formData, config)
        .then(resp => {
          console.log(resp);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}

export default UploadImage;
