import { FC } from 'react';
import { useAllTagList } from '@/modules/tag/useAllTagList';
import Link from 'next/link'
import { Indicator } from './Indicator';
import { Errors } from './Errors';

export const TagList: FC = () => {
  const [loading, errors, tags] = useAllTagList();

  return (
    <div>
      <p>Tags</p>
      {(() => {
        if (loading) return <Indicator />;
        if (errors) return <Errors errors={errors} />;
        return (
          <ul>
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link href={`/?tag_id=${tag.id}`}>{tag.attributes.name}</Link>
              </li>
            ))}
          </ul>
        );
      })()}
    </div>
  );
};
