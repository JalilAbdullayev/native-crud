import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";

const RootLayout = () =>
    <SafeAreaProvider>
        <Stack>
            <Stack.Screen name='index' options={{headerShown: false}}/>
        </Stack>
    </SafeAreaProvider>;

export default RootLayout;