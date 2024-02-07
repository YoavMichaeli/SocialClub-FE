import React from 'react'
import {
  ModalContent,
  ModalActions,
  Button,
  Header,
  Icon,
  Modal,
} from 'semantic-ui-react'
import { deleteUserPost } from '../../../services/UserService';

interface DeleteModalProps {
    postId: string;
    fetchUserPosts: CallableFunction;
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const [open, setOpen] = React.useState(false)
  const {postId, fetchUserPosts} = props;

  const handleDeletePost = async (postId: string) => {
    await deleteUserPost(postId);
    fetchUserPosts();
    setOpen(false);
  };

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={<button id="icon" className="ui button red tiny">
      <div className="centered-icon">
        <i className="trash icon"></i>
      </div>
    </button>}
    >
      <Header icon>
        <Icon name='trash' />
        Post Deletion
      </Header>
      <ModalContent>
        <p>
          Are you sure you want to delete this post?
        </p>
      </ModalContent>
      <ModalActions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={() => handleDeletePost(postId)}>
          <Icon name='checkmark' /> Yes
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default DeleteModal