import React, {Component} from 'react';
import Dragula from 'react-dragula';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import {Icon} from 'react-icons-kit'
import {androidAdd, androidMoreVertical} from 'react-icons-kit/ionicons/'
import './App.css';

const API = 'http://localhost:8000/api/v1/';
const COLUMNS_QUERY = 'boards/9/columns/';

class Card extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentWillMount() {
        ReactModal.setAppElement('body');
    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    handleCloseModal() {
        this.setState({showModal: false});
    }

    render() {
        return (
            <li className="drag-item" id={this.props.id} onClick={this.handleOpenModal}>
                <h3>{this.props.title}</h3>

                {this.props.labels.map(
                    (label, i) => <span key={i} className="card-label"
                                        style={{background: label.color}}>{label.title}</span>
                )}

                <ReactModal isOpen={this.state.showModal} onRequestClose={this.handleCloseModal}
                            contentLabel="Minimal Modal Example">
                    <input type="text" defaultValue={this.props.title}/>
                    <textarea rows="4" cols="60" defaultValue={this.props.description}/>

                    {this.props.assignees.map(
                        (assignee, i) => <p key={i} style={{color: 'black'}}>{assignee.username}</p>
                    )}

                    <button onClick={this.handleCloseModal}>Close Modal</button>
                </ReactModal>
            </li>
        )
    }
}

class Column extends Component {

    render() {
        console.log(this.props.cards);
        return (
            <li className="drag-column">
                <span className="drag-column-header" style={{background: this.props.color}}>
                    <h2>{this.props.title}</h2>
                    <span>
                        <Icon icon={androidAdd} size={24} className="drag-header-more" style={{color: 'black'}}/>
                        <Icon icon={androidMoreVertical} size={24} className="drag-header-more"
                              style={{color: 'black'}}/>
                    </span>
                    <div className="line-break"/>
                    <span
                        className="drag-header-count">{this.props.cards.length} {this.props.cards.length !== 1 ? "Cards" : "Card"}</span>
                </span>

                <div className="drag-options" id={"options" + this.props.id}/>
                <ul className="drag-inner-list" id={this.props.id}
                    // ref={this.dragulaDecorator}
                >
                    {this.props.cards.map(
                        (card, i) => <Card key={i}
                                           id={card.pk}
                                           ref={card.pk}
                                           {...card}/>
                    )}
                </ul>
            </li>
        )
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [],
        }
    }

    componentDidMount() {
        fetch(API + COLUMNS_QUERY)
            .then(response => response.json())
            .then(data => this.setState({columns: data}));

        const column = ReactDOM.findDOMNode(this);
        Dragula([column], {
            isContainer: function (el) {
                return el.classList.contains('drag-inner-list');
            },
            moves(el, container, handle) {
                return handle.classList.contains('drag-item');
            },
            accepts(el, target, source, sibling) {
                return target.classList.contains('drag-inner-list');
            }
        }).on('drop', function (el, target, source) {
            console.log(el);
            console.log('Card id: ' + el.id);
            console.log(source);
            console.log('Source Column id: ' + source.id);
            console.log(target);
            console.log('Target Column id: ' + target.id)
        })

    }

    render() {
        return (
            <div className="drag-container">
                <ul className="drag-list">
                    {this.state.columns.map(
                        (column, i) => <Column key={i}
                                               id={column.position}
                                               title={column.title}
                                               color={column.header_color}
                                               cards={column.card_set}/>
                    )}
                </ul>
            </div>
        )
    }
}

export default App;
