import {FlatList, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {data, Todo} from "@/data/todos";
import {SafeAreaView} from "react-native-safe-area-context";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useFonts} from "expo-font";
import {Inter_500Medium} from "@expo-google-fonts/inter";

const Index = () => {
    const [todos, setTodos] = useState(data.sort((a: Todo, b: Todo) => b.id - a.id));
    const [text, setText] = useState('');
    const [loaded, error] = useFonts({Inter_500Medium});

    if(!loaded && !error) return null;

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

    const renderItem = ({item}) =>
        <View style={styles.toDoItem}>
            <Text style={[styles.toDoText, item.completed && styles.completedText]}
                  onPress={() => toggleTodo(item.id)}>
                {item.title}
            </Text>
            <Pressable onPress={() => removeTodo(item.id)}>
                <MaterialCommunityIcons name='delete-circle' size={36} color='red' selectable={undefined}/>
            </Pressable>
        </View>

    return <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Add a new todo" placeholderTextColor="gray" value={text}
                       onChangeText={setText}/>
            <Pressable onPress={addTodo} style={styles.addButton}>
                <Text style={styles.addButtonText}>
                    Add
                </Text>
            </Pressable>
        </View>
        <FlatList data={todos} renderItem={renderItem} keyExtractor={todo => todo.id.toString()}
                  contentContainerStyle={{flexGrow: 1}}/>
    </SafeAreaView>
}

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
        color: 'white'
    },
    addButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10
    },
    addButtonText: {
        color: 'black',
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
        color: 'white'
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'gray'
    }
});