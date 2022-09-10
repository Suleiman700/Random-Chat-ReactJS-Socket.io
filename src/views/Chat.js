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
import { useHistory } from "react-router-dom";
import socket from 'Socket'

const Welcome = () => {

    const history = useHistory();
    const [clientName, setClientName] = useState('Suleiman'); // Client name

    let other_joined = false
    const other_img_style = {filter: 'blur(8px)'}

    // Modal
    const [modalIsOpen,setModalIsOpen] = useState(false);
    const setModalIsOpenToTrue =()=>{setModalIsOpen(true)}
    const setModalIsOpenToFalse =()=>{setModalIsOpen(false)}

    const [msg_input_err, set_msg_input_err] = useState(false) // If message input marked with red border

    // Style
    const style = {
        msg_input_style: {
            border: msg_input_err?'1px solid red':''
        },
        chat_message: {border: '1px solid #80808026', borderRadius: '25px', padding: '5px 20px', margin: 'auto'}
    }

    const redirect_to_welcome = () => {
        history.push('/app/welcome');
    }

    useEffect(() => {
        // const socket = socketIOClient(ENDPOINT);
        // socket.on("FromAPI", data => {
        //     setResponse(data);
        // });

        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            // setModalIsOpenToTrue()
            return "";
        };
        window.addEventListener("beforeunload", unloadCallback);



    }, []);

    // Message input on change
    const msgInputOnChange = () => {
        set_msg_input_err(false)
    }

    const sendMessage = () => {
        // Get message
        const message = document.getElementById('message')
        const message_section = document.getElementById('message_section')

        // Check message
        if (message.value.replace(/\s/g,"") === "") {
            set_msg_input_err(true)
            message.value = ''
        }
        else {
            set_msg_input_err(false)
        }
    }

    // Check if user has joined a room
    socket.emit("check_if_user_joined_room", {}, (user_found) => {
        // Redirect to welcome page if user did not join any room
        if (!user_found['state']) {
            history.push('/app/welcome');
        }
        // User found
        else {
            const name = user_found['name']
            setClientName(name)
        }
    });


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
                        <Form role="form">
                            {/*{cbMSG? <div className="alert alert-danger text-center mb-3" role="alert">{cbMSG}</div>:''}*/}

                            <div className="mb-3">
                                <Col xs="12">
                                    <div className="row">
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
                                        <Col xs="6">
                                            <div className="card">
                                                <div className="card-body text-center">
                                                    <div className="row text-center d-flex align-items-center text-center">
                                                        <Col>
                                                            <img
                                                                src="https://doodleipsum.com/700/avatar-2"
                                                                className="img-fluid profile-image"
                                                                width="70"
                                                                style={other_img_style}
                                                            />
                                                        </Col>
                                                        <Col className="d-flex align-items-center">
                                                            <div className="row">
                                                                <Col xs="12">
                                                                    <strong className="text-primary">Other</strong>
                                                                </Col>
                                                                <Col xs="12">
                                                                    <button className="btn btn-primary" type="button" disabled>
                                                                        <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true"/>
                                                                        Waiting...
                                                                    </button>
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
                                        <div className="media media-chat">
                                            {/*<img className="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." />*/}
                                            <button className="btn btn-primary" disabled>Other</button>
                                            <div className="media-body mx-3">
                                                <div className="mb-3">
                                                    <p style={style.chat_message}>Hi</p>
                                                    <small className="text-muted px-3">12:34</small>
                                                </div>
                                                <div className="mb-3">
                                                    <p style={style.chat_message}>How are you doing ?</p>
                                                    <small className="text-muted px-3">12:34</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="media media-chat">
                                            <div className="media-body mx-3">
                                                <div className="mb-3">
                                                    <p style={style.chat_message}>Hello friend :)</p>
                                                    <small className="text-muted px-3">12:34</small>
                                                </div>
                                                <div className="mb-3">
                                                    <p style={style.chat_message}>How are you doing ?</p>
                                                    <small className="text-muted px-3">12:34</small>
                                                </div>
                                            </div>
                                            <button className="btn btn-success" disabled>You</button>
                                        </div>
                                    </div>
                                </div>

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
                                    <Button className="mt-4" color="primary" type="button" onClick={sendMessage}>
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};

export default Welcome;
