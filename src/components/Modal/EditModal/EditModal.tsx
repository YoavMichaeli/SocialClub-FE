import React, { PropsWithChildren, ReactNode, useRef } from "react";
import { ModalContent, ModalActions, Button, Header, Icon, Modal } from "semantic-ui-react";
import { updateUserPost } from "../../../services/UserService";

interface EditModalProps {
  postId: string;
  fetchUserPosts: CallableFunction;
  authorId: string;
}

const EditModal: React.FC<EditModalProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = useRef<any>();
  const {postId, fetchUserPosts, authorId} = props;

  const onFormSubmit = async (event: any) => {
    event.preventDefault();
    await updateUserPost(postId, inputRef.current.value, undefined, authorId);
    setOpen(false);
    fetchUserPosts();
  };

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <button id="icon" className="ui button gray tiny">
          <div className="centered-icon">
            <i className="edit icon"></i>
          </div>
        </button>
      }
    >
      <Header icon>
        <Icon name="edit" />
        Edit Post Caption
      </Header>
      <ModalContent>
        <div className="ui container">
          <form className="ui form">
            <div className="field">
              <div className="ui massive icon input">
                <input type="text" placeholder="Write your new caption here..." ref={inputRef} />
              </div>
            </div>
          </form>
        </div>
      </ModalContent>
      <ModalActions>
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button color="green" inverted onClick={onFormSubmit}>
          <Icon name="checkmark" /> Save
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default EditModal;
