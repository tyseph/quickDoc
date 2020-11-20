import React, { Component } from "react";
import {
	StyleSheet,
	FlatList,
	Text,
	View,
	Button,
	Modal,
	StatusBar,
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import { TextInput } from "react-native-gesture-handler";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menu: [],
			name: "",
			number: "",
			profession: "",
			modalVisible: false,
		};
	}

	onSubmit = () => {
		if (
			this.state.name == "" ||
			this.state.number == "" ||
			this.state.profession == ""
		) {
			window.alert("Enter fields first");
		} else {
			window.alert("Press OK to continue");
			firestore()
				.collection("quickDoc")
				.doc(this.state.name)
				.set({
					name: this.state.name,
					number: this.state.number,
					profession: this.state.profession,
				})
				.then(() => {
					console.log("User added!");
					this.setState({
						name: "",
						number: "",
						profession: "",
					});
					this.setModalVisible(false);
				});
		}
	};

	componentDidMount() {
		firestore()
			.collection("quickDoc")
			.onSnapshot((querySnapshot) => {
				const list = [];
				querySnapshot.forEach((doc) => {
					const { name, number, profession } = doc.data();

					{
						list.push({
							id: doc.id,
							name,
							number,
							profession,
						});
						this.setState({
							menu: list,
						});
					}
				});
			});
	};

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	render() {
		return (
			<View style={{ height: "100%" }}>
				<StatusBar hidden={false} backgroundColor="white" />
				<Text style={styles.title}>QuickDoc</Text>
				<FlatList
					style={{ height: "85%" }}
					data={this.state.menu}
					keyExtractor={(elem) => elem.id}
					renderItem={(elem) => (
						<View style={styles.Box}>
							<Text style={styles.name}>
								{elem.item.name}
								<Text style={styles.profession}> ({elem.item.profession})</Text>
							</Text>
							<Text style={styles.number}>{elem.item.number}</Text>
						</View>
					)}
				/>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					statusBarTranslucent={true}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={{fontSize: 30, textAlign: 'center', fontWeight: 'bold'}}>Enter Details</Text>
							<View style={{marginBottom: 25}}>
								<TextInput
									style={styles.TextInput}
									placeholder="name"
									value={this.state.name}
									onChangeText={(value) => this.setState({ name: value })}
								/>
								<TextInput
									style={styles.TextInput}
									keyboardType="number-pad"
									placeholder="number"
									value={this.state.number}
									onChangeText={(value) => this.setState({ number: value })}
								/>
								<TextInput
									style={styles.TextInput}
									placeholder="profession"
									value={this.state.profession}
									onChangeText={(value) => this.setState({ profession: value })}
								/>
							</View>
							<Button title="Submit" onPress={this.onSubmit} />
							<Button
								title="Cancel"
								onPress={() => {
									this.setModalVisible(false);
								}}
							/>
						</View>
					</View>
				</Modal>
				<Button
					title="Enter Details"
					onPress={() => {
						this.setModalVisible(true);
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		color: "purple",
		textAlign: "center",
		fontWeight: "900",
		fontSize: 50,
	},
	Box: {
		margin: 5,
		padding: 25,
		borderWidth: 2,
		borderRadius: 25,
	},
	name: {
		fontWeight: "bold",
		color: "black",
		fontSize: 30,
		marginRight: 50,
	},
	profession: {
		fontSize: 15,
		fontWeight: "200",
		padding: 10,
	},
	number: {
		fontSize: 20,
		fontWeight: "200",
	},
	centeredView: {
		justifyContent: 'center',
		alignSelf: 'center',
		width: '90%',
		flex: 1,
	},
	modalView: {
		borderWidth: 2,
		padding: 15,
		borderRadius: 25
	},
	TextInput: {
		fontSize: 20,
		fontWeight: "200",
		borderBottomWidth: 1,
	}
});
