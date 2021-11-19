import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Moralis = require('moralis');
const serverUrl = "https://elddabsw3kbf.usemoralis.com:2053/server";
const appId = "GtS9MzGzz8Vq7PkM80BBI52svjTJAnzInRogj1JN";
Moralis.start({ serverUrl, appId });

class DeptLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
            accounts: this.props.accounts,
            contract: this.props.contract,
            deptauth: this.props.deptauth,
        };
    }

    componentDidMount() {

    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onSubmit = async (e) => {
        e.preventDefault();
        const { accounts, contract } = this.state;

        try {

            const user = await Moralis.authenticate({ signingMessage: "Authenticating Your Account" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user.get("ethAddress"));

                })
                .catch(function (error) {
                    console(error);
                });

            const res = await contract.methods.getHead(accounts[0]).call();

            console.log(res)

            const depthead = {
                id: res[0],
                deptname: res[1],
                mgraddr: res[2],
                projectCount: res[3]
            }

            if (res[0] != 0) {
                console.log("Signed On Department")
                console.log("res:", JSON.stringify(depthead))
                this.props.deptfunc(depthead)
                localStorage.setItem("deptData", JSON.stringify(depthead));
                this.props.history.push("/deptdashboard");
            }
            else {
                console.log("Please Sign Up")
                toast.error('You are not a Department Head!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        catch {
            toast.error('Authentication Failed!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    };
    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div style={{ marginTop: "4rem" }} className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Back to
                            home
                        </Link>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <h4>
                                <b>Login</b> below
                            </h4>
                            <p className="grey-text text-darken-1">
                                Don't have an account? Go Home Senor
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>

                            <div className="col s12" style={{ paddingLeft: "11.250px", paddingTop: "2rem" }}>
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {/* Same as */}
                <ToastContainer />
            </div>
        );
    }
}
export default withRouter(DeptLogin);