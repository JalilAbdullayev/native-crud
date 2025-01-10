import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {data, Todo} from "@/data/todos";
import {SafeAreaView} from "react-native-safe-area-context";
import {MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {Inter_500Medium} from "@expo-google-fonts/inter";
import {ThemeContext} from "@/context/ThemeContext";
import Animated, {LinearTransition} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "expo-status-bar";
import {useRouter} from "expo-router";

const Index = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [loaded, error] = useFonts({Inter_500Medium});
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async() => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp");
                const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;
                if(storageTodos && storageTodos.length) {
                    setTodos(storageTodos.sort((a, b) => b.id - a.id))
                } else {
                    setTodos(data.sort((a, b) => b.id - a.id));
                }
            } catch(e) {
                console.error(e);
            }
        }
        fetchData();
    }, [data]);

    useEffect(() => {
        const storeData = async() => {
            try {
                const jsonValue = JSON.stringify(todos);
                await AsyncStorage.setItem("TodoApp", jsonValue);
            } catch(e) {
                console.error(e);
            }
        }
        storeData();
    }, [todos]);

    if(!loaded && !error) return null;

    const styles = createStyles(theme, colorScheme);

    const addTodo = () => {
        if(text.trim()) {
            const newId: number = todos.length > 0 ? todos[0].id + 1 : 1;
            setTodos([{id: newId, title: text, completed: false}, ...todos]);
            setText('');
        }
    }

    const removeTodo = (id: number) =>
        setTodos(todos.filter((todo: Todo) => todo.id !== id));

    const toggleTodo = (id: number) => setTodos(todos.map((todo: Todo): Todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo));

    const handlePress = (id: number) => router.push(`/todos/${id}`);

    const renderItem = ({item}: { item: Todo }) =>
        <View style={styles.toDoItem}>
            <Pressable onPress={() => handlePress(item.id)} onLongPress={() => toggleTodo(item.id)}>
                <Text style={[styles.toDoText, item.completed && styles.completedText]}>
                    {item.title}
                </Text>
            </Pressable>
            <Pressable onPress={() => removeTodo(item.id)}>
                <MaterialCommunityIcons name='delete-circle' size={36} color='red' selectable={undefined}/>
            </Pressable>
        </View>

    return <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Add a new todo" placeholderTextColor="gray" value={text}
                       onChangeText={setText} maxLength={30}/>
            <Pressable onPress={addTodo} style={styles.addButton}>
                <Text style={styles.addButtonText}>
                    Add
                </Text>
            </Pressable>
            <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                       style={{marginLeft: 10}}>
                {colorScheme === 'dark' ?
                    <Octicons name='moon' size={36} color={theme.text} selectable={undefined} style={{width: 36}}/> :
                    <Octicons name='sun' size={36} color={theme.text} selectable={undefined} style={{width: 36}}/>}
            </Pressable>
        </View>
        <Animated.FlatList data={todos} renderItem={renderItem} keyExtractor={todo => todo.id.toString()}
                           contentContainerStyle={{flexGrow: 1}} itemLayoutAnimation={LinearTransition}
                           keyboardDismissMode='on-drag'/>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
    </SafeAreaView>
}

export default Index;

const createStyles = (theme, colorScheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        width: '100%',
        maxWidth: 1024,
        marginHorizontal: 'auto',
        pointerEvents: 'auto'
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        minWidth: 0,
        color: theme.text
    },
    addButton: {
        backgroundColor: theme.button,
        borderRadius: 5,
        padding: 10
    },
    addButtonText: {
        color: colorScheme === 'dark' ? 'black' : 'white',
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
    },
    toDoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
        maxWidth: 1024,
        marginHorizontal: 'auto',
        pointerEvents: 'auto'
    },
    toDoText: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        color: theme.text
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'gray'
    }
});