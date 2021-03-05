import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, position } from "@chakra-ui/react";
import React from "react";
import {
  PostSnippetFragment,
  PostsQuery,
  useVoteMutation,
  VoteMutationVariables,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        aria-label="updoot post"
        post
        icon={<ChevronUpIcon />}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          await vote({
            postId: post.id,
            value: 1,
          });
        }}
      />
      {post.points}
      <IconButton
        aria-label="downdoot post"
        icon={<ChevronDownIcon />}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          await vote({
            postId: post.id,
            value: -1,
          });
        }}
      />
    </Flex>
  );
};
