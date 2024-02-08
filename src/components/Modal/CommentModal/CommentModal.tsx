import React, { useRef } from "react";
import {
  Button,
  Header,
  Image,
  Modal as SemanticModal,
  ModalActions,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ListItem,
  ListIcon,
  ListHeader,
  ListDescription,
  ListContent,
  List,
  Icon,
} from "semantic-ui-react";
import Cookies from "universal-cookie";
import config from "../../../config";
import { updateUserPost } from "../../../services/UserService";

import "./CommentModal.css";

export interface PostComment {
  by: string;
  text: string;
}

interface CommentModalProps {
  postAuthor: string;
  authorId: string;
  postId: string;
  post_static_url: string;
  comments: Array<PostComment>;
  imageType: string;
  fetchUserPosts: CallableFunction;
}

const CommentModal: React.FC<CommentModalProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const { postAuthor, post_static_url, comments, imageType, postId, fetchUserPosts, authorId} = props;
  const inputRef = useRef<any>('');

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const cookie = new Cookies();
  const token: string = cookie.get("access_token");
  const decoded_token: any = parseJwt(token);
  let currentUsername: any;

  if (decoded_token) {
    currentUsername = decoded_token.user;
  }

  const onFormSubmit = async (event: any) => {
    event.preventDefault();
    await updateUserPost(postId, '', {text: inputRef.current.value, by: currentUsername}, authorId);
    fetchUserPosts();
  };

  return (
    <SemanticModal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <button id="icon" className="ui button teal tiny">
          <div className="centered-icon">
            <i className="comment icon"></i>
          </div>
        </button>
      }
    >
      <ModalHeader>Uploaded by {postAuthor}</ModalHeader>
      <div id="addCommentContainer" className="ui centered container">
        <form className="ui form">
          <div className="ui action input">
            <input ref={inputRef} type="text" placeholder="Add a new comment here" />
            <Button color="green" onClick={onFormSubmit}>
              <Icon name="plus" /> Add Comment
            </Button>
          </div>
        </form>
      </div>
      <ModalContent image scrolling>
        {imageType == "png" || imageType == "jpg" || imageType == "jpeg" ? (
          <Image size="medium" src={config.SERVER_URL + post_static_url} wrapped />
        ) : (
          <video id="cardImage" src={config.SERVER_URL + post_static_url} controls></video>
        )}
        <ModalDescription id="description">
          <Header>Comments</Header>
          {comments.map((comment) => {
            return (
              <List divided relaxed>
                <ListItem>
                  <ListIcon name="comment" size="large" verticalAlign="middle" />
                  <ListContent>
                    <ListHeader id="commentHeader">{comment.by}</ListHeader>
                    <ListDescription id="commentDescription">{comment.text}</ListDescription>
                  </ListContent>
                </ListItem>
              </List>
            );
          })}
        </ModalDescription>
      </ModalContent>
      <ModalActions>
        <Button color="black" onClick={() => setOpen(false)}>
          Back to feed
        </Button>
      </ModalActions>
    </SemanticModal>
  );
};

export default CommentModal;
