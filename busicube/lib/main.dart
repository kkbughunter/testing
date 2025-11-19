import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "Person CRUD",
      theme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      home: PersonPage(),
    );
  }
}

class PersonPage extends StatefulWidget {
  @override
  State<PersonPage> createState() => _PersonPageState();
}

class _PersonPageState extends State<PersonPage> {
  final String baseUrl = "http://astraval.com:8085/api/persons";

  List persons = [];
  int? selectedId;
  bool isLoading = false;

  final nameController = TextEditingController();
  final ageController = TextEditingController();

  File? selectedImage;

  @override
  void initState() {
    super.initState();
    fetchPersons();
  }

  Future<void> fetchPersons() async {
    setState(() => isLoading = true);
    try {
      final res = await http.get(Uri.parse(baseUrl));
      if (res.statusCode == 200) {
        setState(() {
          persons = jsonDecode(res.body);
        });
      } else {
        showSnackBar("Failed to load persons: ${res.statusCode}");
      }
    } catch (e) {
      showSnackBar("Error: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      final file = File(picked.path);
      if (await file.length() > 5 * 1024 * 1024) {
        // Limit file size to 5MB
        showSnackBar("Image too large! Maximum 5MB allowed.");
        return;
      }
      setState(() => selectedImage = file);
    }
  }

  Future<void> submitPerson() async {
    if (nameController.text.isEmpty || ageController.text.isEmpty) {
      showSnackBar("Name and Age cannot be empty!");
      return;
    }

    setState(() => isLoading = true);

    try {
      var uri = Uri.parse(
        selectedId == null ? "$baseUrl/create" : "$baseUrl/update/$selectedId",
      );
      var req = http.MultipartRequest(selectedId == null ? "POST" : "PUT", uri);

      req.fields["name"] = nameController.text;
      req.fields["age"] = ageController.text;

      if (selectedImage != null) {
        req.files.add(await http.MultipartFile.fromPath("image", selectedImage!.path));
      }

      var res = await req.send();
      if (res.statusCode == 200 || res.statusCode == 201) {
        fetchPersons();
        clearForm();
        showSnackBar(selectedId == null ? "Person created!" : "Person updated!");
      } else {
        showSnackBar("Error: ${res.statusCode}");
      }
    } catch (e) {
      showSnackBar("Error: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> deletePerson(int id) async {
    setState(() => isLoading = true);
    try {
      final res = await http.delete(Uri.parse("$baseUrl/delete/$id"));
      if (res.statusCode == 200) {
        fetchPersons();
        showSnackBar("Person deleted successfully!");
      } else {
        showSnackBar("Delete failed: ${res.statusCode}");
      }
    } catch (e) {
      showSnackBar("Error: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  void selectPerson(person) {
    setState(() {
      selectedId = person["id"];
      nameController.text = person["name"];
      ageController.text = person["age"].toString();
      selectedImage = null;
    });
  }

  void clearForm() {
    setState(() {
      selectedId = null;
      nameController.clear();
      ageController.clear();
      selectedImage = null;
    });
  }

  void showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Astraval Persons"),
        centerTitle: true,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: pickImage,
        label: Text("Choose Image"),
        icon: Icon(Icons.image),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // FORM CARD
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Text(
                            selectedId == null ? "Create New Person" : "Update Person",
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 16),
                          TextField(
                            controller: nameController,
                            decoration: InputDecoration(
                              labelText: "Name",
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                          SizedBox(height: 12),
                          TextField(
                            controller: ageController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: "Age",
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                          SizedBox(height: 12),
                          if (selectedImage != null)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.file(
                                selectedImage!,
                                height: 140,
                                width: double.infinity,
                                fit: BoxFit.cover,
                              ),
                            ),
                          SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ElevatedButton.icon(
                                onPressed: submitPerson,
                                icon: Icon(selectedId == null ? Icons.add : Icons.update),
                                label: Text(selectedId == null ? "Create" : "Update"),
                                style: ElevatedButton.styleFrom(
                                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              ),
                              if (selectedId != null)
                                OutlinedButton.icon(
                                  onPressed: clearForm,
                                  icon: Icon(Icons.clear),
                                  label: Text("Cancel"),
                                  style: OutlinedButton.styleFrom(
                                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                  // LIST
                  ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: persons.length,
                    itemBuilder: (context, index) {
                      var p = persons[index];
                      return Card(
                        elevation: 3,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ListTile(
                          contentPadding: EdgeInsets.all(12),
                          leading: ClipRRect(
                            borderRadius: BorderRadius.circular(50),
                            child: p["imageUrl"] != null
                                ? Image.network(
                                    "http://astraval.com:8085${p['imageUrl']}",
                                    width: 55,
                                    height: 55,
                                    fit: BoxFit.cover,
                                  )
                                : CircleAvatar(
                                    radius: 28,
                                    child: Icon(Icons.person, size: 30),
                                  ),
                          ),
                          title: Text(
                            p["name"],
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                          ),
                          subtitle: Text("Age: ${p['age']}"),
                          onTap: () => selectPerson(p),
                          trailing: IconButton(
                            icon: Icon(Icons.delete, color: Colors.red),
                            onPressed: () => deletePerson(p["id"]),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }
}
