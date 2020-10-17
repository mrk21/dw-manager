import { FC, Fragment } from 'react';
import { History } from '@/entities/History';
import Chip from '@material-ui/core/Chip';
import Link from 'next/link';
import { useTagList } from '@/modules/tag/useTagList';
import { Indicator } from './Indicator';
import { Errors } from './Errors';

type Props = {
  history: History
};

export const HistoryTagList: FC<Props> = ({ history }) => {
  const [ loading, errors, tags ] = useTagList(history.relationships.tags.data.map(t => t.id));

  if (loading) return <Indicator />;
  if (errors) return <Errors errors={errors} />;
  return (
    <div>
      {tags.map((tag) => (
        <Fragment key={tag.id}>
          <Link href={`/?tag_id=${tag.id}`}>
            <Chip size="small" label={tag.attributes.name} clickable />
          </Link>
          &nbsp;
        </Fragment>
      ))}
    </div>
  );
};
