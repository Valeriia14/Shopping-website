import { Note, Order, transact } from "@kidztime/models";
import { Op } from "sequelize";
import { GenericOpts } from "../types";

export const update_notes = async (
  props: Note[],
  order_id: string,
  opts: GenericOpts = {}
) => {
  const updated_note = await transact(opts.transaction).run<any>(
    async (transaction) => {
      const ids = props.map((e) => e.id);
      const destroyed_note = await Note.destroy({
        where: {
          owner_id: order_id,
          owner_type: Order.name,
          assoc_type: Order.NoteAssoc.adminNote,
          id: { [Op.notIn]: ids },
        },
        transaction,
      }); 
      const updating_note = await Promise.all(
        props.map((note) => {
          return Note.update(
            {
              ...note,
            },
            {
              where: {
                owner_id: order_id,
                owner_type: Order.name,
                assoc_type: Order.NoteAssoc.adminNote,
                id: note.id,
              },
              transaction,
            }
          );
        })
      );
      return [destroyed_note, ...updating_note];
    }
  );
  return updated_note;
};
