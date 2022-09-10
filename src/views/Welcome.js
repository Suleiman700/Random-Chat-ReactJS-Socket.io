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
} from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import socket from 'Socket'

const Welcome = () => {

    const history = useHistory();
    const [errorName, setErrorName] = useState(''); // Name
    const [errorTOS, setErrorTOS] = useState(''); // TOS
    const [cbMSG, setCbMSG] = useState(''); // Callback
    const [name, setName] = useState('');

    useEffect(() => {
        // const socket = socketIOClient(ENDPOINT);
        // socket.on("FromAPI", data => {
        //     setResponse(data);
        // });


    }, []);



    // Validate name
    const validate_name = () => {
        let valid = true

        const name = document.getElementById('name').value
        if (name === '') {
            valid = false
            setErrorName('Please enter your name!')
            setName('')
        }
        else {
            setErrorName('')
            setName(name)
        }

        return valid
    }

    // Validate TOS
    const validate_tos = () => {
        let valid = true
        const tos = document.getElementById('tos')

        if (tos.checked) {
            valid = true
            setErrorTOS('')
        }
        else {
            valid = false
            setErrorTOS('You need to agree to TOS!')
        }

        return valid
    }

    // Handle name on change
    function handleNameChange() {
        validate_name()
    }

    // Handle TOS on check
    function handleTOSCheck() {
        validate_tos()
    }

    // Handle join button click
    const handle_join = () => {
        const valid_name = validate_name()
        const tos_checked = validate_tos()

        if (valid_name && tos_checked) {

            socket.emit("join", {
                name
            }, (response) => {
                // Handle callback
                const state = response['state']

                console.log(state)

                if (state) {
                    setCbMSG('')
                    history.push('/app/chat');
                }
                else if (!state) {
                    // Get error message
                    const msg = response['msg']
                    setCbMSG(msg)
                }
            });
        }
    }


    socket.on('test', () => {
        alert('here')
    })


    return (
        <>



            <Col lg="6" md="8">
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <Form role="form">
                            {cbMSG? <div className="alert alert-danger text-center mb-3" role="alert">{cbMSG}</div>:''}

                            <FormGroup className="mb-0">
                                <InputGroup className="input-group-alternative mb-3">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-single-02"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Name"
                                        id="name"
                                        type="text"
                                        onChange={() => handleNameChange()}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <div className="font-italic text-danger">
                                <small>{errorName}</small>
                            </div>
                            <Row className="my-4">
                                <Col xs="12">
                                    <div className="custom-control custom-control-alternative custom-checkbox text-center">
                                        <input
                                            className="custom-control-input"
                                            id="tos"
                                            type="checkbox"
                                            onChange={() => handleTOSCheck()}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="tos"
                                        >
                                          <span className="text-muted">
                                            I agree with the{" "}
                                              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                              Privacy Policy
                                            </a>
                                          </span>
                                            <div className="font-italic text-danger">
                                                <small>{errorTOS}</small>
                                            </div>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            <div className="text-center">
                                <Button className="mt-4" color="primary" type="button" onClick={(e) => handle_join()}>
                                    Start Chatting!
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};

export default Welcome;
