import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import java.io.File
import java.io.FileNotFoundException
import java.io.FileWriter
import java.io.IOException
import kotlin.system.exitProcess

fun readFromDb(filePath: String): MutableList<String> {
    val tasks: MutableList<String> = mutableListOf()
    val lines = File(filePath).readLines()
    for (line in lines) {
        tasks.add(line)
    }

    return tasks
}

fun writeToDb(filePath: String, text: String) {
    val fw = FileWriter(filePath)
    fw.write(text)
    fw.close()
}

fun main() = application {
    val fr = javax.swing.JFileChooser()
    val fsv = fr.fileSystemView
    val cwd = fsv.defaultDirectory.toString()
    var tasks: MutableList<String> = mutableListOf()
    val db = "$cwd/db"
    val taskDelimiter = "~"
    var errorNotification = ""

    try {
        tasks = readFromDb(db)
    } catch (e: FileNotFoundException) {
        errorNotification = "File could not be found, created a new one!"
        try {
            writeToDb(db, "Dummy Task")
        } catch (e: IOException) {
            errorNotification = "Could not write new data"
        } catch (e: Exception) {
            println("Unknown file write error: $e")
            exitProcess(1)
        }
    } catch (e: Exception) {
        println("Unknown file read error: $e")
        exitProcess(1)
    }

    Window(
        onCloseRequest = ::exitApplication,
        title = "Todo App",
        state = rememberWindowState(width = 500.dp, height = 500.dp),
        resizable = true,
    ) {
        val todoInputText = remember { mutableStateOf("") }
        val todos = remember { mutableStateOf(tasks) }
        val notification = remember { mutableStateOf(errorNotification) }
        val hideCompleted = remember { mutableStateOf(false) }

        fun addItemToTodo(): Unit {
            notification.value = ""
            if (todoInputText.value.trim().isEmpty()) {
                notification.value = "NOTIFICATION: You need to enter a valid value"
            } else if (todoInputText.value in todos.value) {
                notification.value = "NOTIFICATION: You already have the same task"
            } else if (todoInputText.value.indexOf(taskDelimiter) != -1) {
                notification.value = "NOTIFICATION: Character \"$taskDelimiter\" not allowed"
            } else {
                // we need to add a delimiter to the task before we add it to the list
                todos.value += "0$taskDelimiter${todoInputText.value}"
                // the below variable will be used to rewrite the db file
                var text = ""
                // here we generate the new db file text
                todos.value.map { todo -> text += "$todo\n" }

                try {
                    writeToDb(db, text)
                    todoInputText.value = ""
                } catch (e: Exception) {
                    notification.value = "NOTIFICATION: Could not save to database"
                }
            }
        }

        MaterialTheme {
            Column(Modifier.fillMaxSize(), Arrangement.spacedBy(5.dp)) {
                if (notification.value.isNotEmpty()) {
                    Text(
                        notification.value,
                        modifier = Modifier.padding(10.dp),
                        color = Color.Red,
                    )
                }

                Row {
                    TextField(
                        value = todoInputText.value,
                        modifier = Modifier.padding(10.dp).onPreviewKeyEvent {
                            when {
                                // it is ctrl because I don't know how to make it enter without
                                // using experimental features
                                (it.isCtrlPressed) -> {
                                    addItemToTodo()
                                    true
                                }
                                else -> false
                            }
                        },
                        label = { Text("Todo text") },
                        onValueChange = { text: String -> todoInputText.value = text },
                    )

                    Button(
                        modifier = Modifier.padding(10.dp),
                        onClick = {
                            addItemToTodo()
                        }) {
                        Text("Add")
                    }

                    Button(
                        modifier = Modifier.padding(10.dp),
                        onClick = { hideCompleted.value = !hideCompleted.value },
                    ) {
                        if (hideCompleted.value) {
                            Text("Show completed")
                        } else {
                            Text("Hide completed")
                        }
                    }
                }

                Box(
                    modifier = Modifier.fillMaxSize().padding(10.dp)
                ) {
                    val stateVertical = rememberScrollState(0)

                    // lol, this scroll bar was hella difficult to get working
                    // https://github.com/JetBrains/compose-jb/tree/master/tutorials/Desktop_Components
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(stateVertical)
                            .padding(end = 12.dp, bottom = 12.dp)
                    ) {
                        Column {
                            for (todo in todos.value) {
                                if (todo.trim().isEmpty()) {
                                    continue
                                }

                                val todoSplit = todo.split(taskDelimiter)
                                val isDone = todoSplit[0] == "1"
                                val todoText = todoSplit[1]

                                // don't show completed tasks if the user has chosen to hide them
                                if (hideCompleted.value && isDone) {
                                    continue
                                }

                                Box(modifier = Modifier.clickable(onClick = {
                                    var text = ""
                                    val completed = if (isDone) "0" else "1"

                                    todos.value.map { todo ->
                                        text += when (todo.split(taskDelimiter)[1]) {
                                            todoText -> "$completed$taskDelimiter${todoText}\n"
                                            else -> "$todo\n"
                                        }
                                    }

                                    try {
                                        writeToDb(db, text)
                                        // there is 100% a faster and better way to do this, but I'm lazy
                                        todos.value = readFromDb(db)
                                    } catch (e: Exception) {
                                        notification.value = "NOTIFICATION: Could not update task"
                                    }
                                })) {
                                    Row {
                                        Spacer(modifier = Modifier.width(16.dp))

                                        Checkbox(
                                            checked = isDone,
                                            modifier = Modifier.align(Alignment.CenterVertically),
                                            onCheckedChange = {
                                                print("checked")
                                            },
                                        )

                                        Spacer(modifier = Modifier.width(8.dp))

                                        Text(
                                            todoText,
                                            modifier = Modifier.padding(15.dp)
                                        )

                                        Spacer(modifier = Modifier.width(50.dp))

                                        Button(
                                            onClick = {
                                                notification.value = ""
                                                todos.value
                                                val allowedTodos: MutableList<String> = mutableListOf()

                                                todos.value.map { selectedTodo ->
                                                    if (selectedTodo != todo) {
                                                        allowedTodos.add(selectedTodo)
                                                    }
                                                }

                                                var text = ""
                                                for (selectedTodo in allowedTodos) {
                                                    text += selectedTodo + "\n"
                                                }

                                                try {
                                                    writeToDb(db, text)
                                                    todos.value = allowedTodos
                                                } catch (e: Exception) {
                                                    notification.value = "NOTIFICATION: Could not save to database"
                                                }

                                            }) {
                                            Text("Delete")
                                        }

                                    }
                                    Divider()

                                }

                            }
                        }
                    }

                    VerticalScrollbar(
                        modifier = Modifier.align(Alignment.CenterEnd)
                            .fillMaxHeight(),
                        adapter = rememberScrollbarAdapter(stateVertical)
                    )
                }
            }
        }
    }
}