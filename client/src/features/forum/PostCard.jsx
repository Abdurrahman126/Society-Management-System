import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, User } from 'lucide-react';
import { formatDistanceToNow,parseISO } from 'date-fns';

const PostCard = ({ id, content, email, likes, time, handler, btn }) => {

  const date = parseISO(time);
  const timePeriod = formatDistanceToNow(date);
  const timeAgo = `${timePeriod} ago`;

  const formattedTime = formatDistanceToNow(new Date(time), { addSuffix: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (btn === 'true') {
      handler(id); 
    } else {
      handler(); 
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <User className="w-4 h-4 inline mr-2" />
          {email}
        </CardTitle>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <form
          method={btn === 'true' ? 'DELETE' : 'POST'}
        
          className="flex items-center"
        >
          <input type="hidden" name="id" value={id} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-black"
            onClick={handler}
          >
            {btn !== 'true' && <ThumbsUp className="w-4 h-4 mr-2" onClick={handler}/>}
            {btn !== 'true' ? 'Like' : 'Delete'}
          </Button>
        </form>
        <span className="text-sm text-muted-foreground">{likes} likes</span>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
