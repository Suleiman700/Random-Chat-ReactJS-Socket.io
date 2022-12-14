/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    Modal
} from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useHistory, Redirect } from "react-router-dom";
import socket from 'Socket'

const Welcome = () => {

    let client_name = ''

    const history = useHistory();
    const [clientName, setClientName] = useState(''); // Client name
    const [otherName, setOtherName] = useState(''); // Other name

    const [sendMsgSectionEnabled, setSendMsgSectionEnabled] = useState(false)

    const [msg_input_err, set_msg_input_err] = useState(false) // If message input marked with red border

    // let other_joined = false

    // Modal
    const [modalIsOpen,setModalIsOpen] = useState(false);
    const setModalIsOpenToTrue =()=>{setModalIsOpen(true)}
    const setModalIsOpenToFalse =()=>{setModalIsOpen(false)}


    // Style
    const style = {
        msg_input_style: {
            border: msg_input_err?'1px solid red':''
        },
        chat_message: {border: '1px solid #80808026', borderRadius: '25px', padding: '5px 20px', margin: 'auto'},
        other_img_style: {filter: 'blur(8px)'}
    }

    const redirect_to_welcome = () => {
        // history.push('/app/welcome');
    }

    useEffect(() => {
        // const socket = socketIOClient(ENDPOINT);
        // socket.on("FromAPI", data => {
        //     setResponse(data);
        // });

        // const unloadCallback = (event) => {
        //     event.preventDefault();
        //     event.returnValue = "";
        //     // setModalIsOpenToTrue()
        //     return "";
        // };
        // window.addEventListener("beforeunload", unloadCallback);


        // Check if user has joined a room
        socket.emit("check_if_user_in_queue", {}, (user_data) => {
            console.log(user_data)
            // console.log('check_if_user_joined_room')

            // Redirect to welcome page if user did not join any room
            if (!user_data['in_queue']) {
                history.push('/app/welcome');
            }
            // User found
            else {
                const name = user_data['name']
                setClientName(name)
                client_name = name
            }
        });

        // Join new room id
        socket.on('do_join_roomid', (data) => {
            console.log('request from server to join a roomid')


            const other_name = data['other_name']
            const new_roomid = data['new_roomid']

            socket.emit("actually_join_roomid", {
                new_roomid: new_roomid
            });

            setSendMsgSectionEnabled(true) // Enable send message section
            setOtherName(other_name) // Set other name

            document.getElementById('waiting_for_text').innerHTML = `${other_name} Has joined the chat`

            // Clear old messages
            document.getElementById('messages_section').innerHTML = ''
        })

        socket.on('receive_message', (data) => {
            receiveMessage(data)
        })

        // Set other user
        socket.on('set_other_name', (data) => {
            const other_name = data['other_name']
            setOtherName(other_name)
        })

        // Other user has left the chat
        socket.on('other_left_the_room', () => {
            setOtherName('') // Clear other name
            setSendMsgSectionEnabled(false) // Disable send message section
            document.getElementById('waiting_for_text').innerHTML = `The other person has left the room...`

            // socket.emit('make_me_leave_chat_room')
        })

    }, []);

    // Message input on change
    const msgInputOnChange = () => {
        set_msg_input_err(false)
    }

    // Send message
    const sendMessage = () => {
        // Get message
        const message = document.getElementById('message')
        const message_section = document.getElementById('message_section')

        // Invalid message
        if (message.value.replace(/\s/g,"") === "") {
            set_msg_input_err(true)
            message.value = ''
        }
        // Valid message
        else {
            set_msg_input_err(false)

            // Send message
            socket.emit("send_message", {
                sender_name: clientName,
                message: message.value
            });

            // Clear message input value
            message.value = ''
        }
    }


    // Get user socket's room id
    const get_socket_roomid = () => {
        socket.emit("get_my_socket_roomid", {});
    }

    // Find someone to chat
    const find_someone_to_chat_with = () => {
        socket.emit("find_someone_to_chat_with", {}, (response) => {

            // Check if found someone to chat with
            // if (response['found']) {
            //     const someone_name = response['someone_name']
            //     setOtherName(someone_name)
            //     document.getElementById('waiting_for_text').innerHTML = `${someone_name} Has joined the chat`
            // }
        });

        document.getElementById('waiting_for_text').innerHTML = `Waiting for someone to chat with...Please wait`
    }

    /**
     * Receive message from socket
     * @param _data {Object}
     */
    const receiveMessage = (_data) => {
        const sender_name = _data['sender_name']
        const message = _data['message']

        // Determine who's the sender
        let sender = null
        // if (sender_name === clientName) sender = 'client'
        if (sender_name === client_name) sender = 'client'
        else sender = 'other'

        // Set message time
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const time = `${hours}:${minutes}`

        // Add message to message section
        const messages_section = document.getElementById('messages_section')


        let msg_html = ''
        if (sender === 'client') {
            msg_html = `
                <div class="media media-chat">
                    <div class="media-body mx-3">
                        <div class="mb-3">
                            <p class="msg_line">${message}</p>
                            <small class="text-muted px-3">${time}</small>
                        </div>
                    </div>
                    <button class="btn btn-success" disabled>${sender_name}</button>
                </div>`
        }

        if (sender === 'other') {
            msg_html = `
                <div class="media media-chat">
                    <button class="btn btn-primary" disabled>${sender_name}</button>
                    <div class="media-body mx-3">
                        <div class="mb-3">
                            <p class="msg_line">${message}</p>
                            <small class="text-muted px-3">${time}</small>
                        </div>
                    </div>
                </div>`
        }

        messages_section.insertAdjacentHTML('beforeend', msg_html);
    }

    const findAnotherPerson = () => {
        socket.emit("find_another_person_to_chat_with", {})

        document.getElementById('waiting_for_text').innerHTML = `You have left the room!`
        
        setOtherName('') // Clear other person name
        setSendMsgSectionEnabled(false)
    }

    const waiting = () => {
        return (
            <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true">Waiting...</span>
        )
    }


    return (
        <>

            <Modal isOpen={modalIsOpen} style={{top: '50%'}}>
                <div className="container text-center">
                    <div className="row text-center mx-5 my-3">
                        <strong>Please notice that reloading the page will cause you to leave the room!</strong>
                    </div>

                    <div className="mb-3">
                        <Button className="mt-4" color="danger" type="button" onClick={redirect_to_welcome}>
                            Yes, Reload!
                        </Button>
                        <Button className="mt-4" color="success" type="button" onClick={setModalIsOpenToFalse}>
                            No, Dont!
                        </Button>
                    </div>
                </div>
            </Modal>

            <Col xs="12">
                {/*<button onClick={setModalIsOpenToTrue}>Click to Open Modal</button>*/}
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        {/*{cbMSG? <div className="alert alert-danger text-center mb-3" role="alert">{cbMSG}</div>:''}*/}
                        <Button onClick={() => get_socket_roomid()}>Get my socket roomid</Button>

                        <div className="mb-3">
                            <Col xs="12">
                                <div className="row">
                                    <Col xs="6">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <div className="row text-center d-flex align-items-center text-center">
                                                    <Col>
                                                        <img
                                                            src="https://doodleipsum.com/700/avatar-2"
                                                            className="img-fluid profile-image"
                                                            width="70"
                                                            style={style['other_img_style']}
                                                        />
                                                    </Col>
                                                    <Col className="d-flex align-items-center">
                                                        <div className="row">
                                                            <Col xs="12">
                                                                <strong className="text-primary">Other</strong>
                                                            </Col>
                                                            <Col xs="12 text-primary">
                                                                {otherName?
                                                                    otherName:
                                                                    <div>
                                                                        ---
                                                                        {/*<button className="btn btn-primary" type="button" disabled>*/}
                                                                        {/*    <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true" />Waiting...*/}
                                                                        {/*</button>*/}
                                                                    </div>
                                                                }
                                                            </Col>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs="6">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <div className="row">
                                                    <Col>
                                                        <img src="https://doodleipsum.com/500/avatar-2" className="img-fluid profile-image" width="70" />
                                                    </Col>
                                                    <Col className="d-flex align-items-center">
                                                        <div className="row">
                                                            <Col xs="12">
                                                                <strong className="text-success">You</strong>
                                                            </Col>
                                                            <Col xs="12">
                                                                {clientName}
                                                            </Col>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                        </div>

                        <div className="container">
                            <div className="mb-5">
                                <div className="card px-3 py-3" style={{height: '50vh', overflowY: 'auto'}}>
                                    <button className="btn btn-secondary" type="button" id="waiting_for_text" disabled>
                                        <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true" />
                                        No one has been joined yet...
                                    </button>
                                    <div id="messages_section"></div>
                                </div>
                            </div>

                            <div id="send_message_section" className={sendMsgSectionEnabled? 'd-block':'d-none'} style={{display: 'block'}}>
                                <FormGroup className="mb-0">
                                    <InputGroup className="input-group-alternative mb-3" id="message_section" style={style.msg_input_style}>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-chat-round"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            type="text"
                                            id="message"
                                            placeholder="Enter your message"
                                            autoComplete="off"
                                            dir="auto"
                                            onChange={msgInputOnChange}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <div className="text-center">
                                    <Button className="mt-4" color="primary" type="button" onClick={() => sendMessage()}>
                                        Send Message
                                    </Button>
                                    <Button className="mt-4" color="danger" type="button" onClick={() => findAnotherPerson()}>
                                        Find Another
                                    </Button>
                                </div>
                            </div>

                            <div className={sendMsgSectionEnabled? 'd-none':'d-block text-center'}>
                                <Button color="primary" type="button" onClick={() => find_someone_to_chat_with()}>
                                    Find Someone To Chat With!
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};

export default Welcome;
