import { Text, View } from "react-native";

import { CircleCheckBig } from "lucide-react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

// import { fontFamily } from './font-family';

const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  tomatoToast: (params: any) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{params.text1}</Text>
      <Text>{params.props?.uuid}</Text>
    </View>
  ),

  addressCopied: (params: any) => (
    <View
      style={{
        backgroundColor: "#6fcf97",
        paddingHorizontal: 16,
        height: 100,
        borderRadius: 0,
        width: "100%",
        marginTop: -40,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 60,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircleCheckBig size={20} color="white" />
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "500",
            fontFamily: "Sora_600SemiBold",
          }}
        >
          {params.text1 || "Address copied"}
        </Text>
      </View>
    </View>
  ),
};

export default toastConfig;
