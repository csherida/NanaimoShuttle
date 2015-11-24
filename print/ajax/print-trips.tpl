<?php if (!empty($trips)): ?>
	<table class="trips-print">
		<thead>
			<?php foreach (get_print_columns(false, $filter) as $column): ?>
				<th><?=$column;?></th>
			<?php endforeach; ?>
		</thead>
		<tbody>
			<?php foreach ($trips as $trip): ?>
				<tr>
					<?php foreach (get_print_columns(false, $filter) as $column): ?>
						<td><?=$trip['print_columns'][$column];?></td>
					<?php endforeach; ?>
				</tr>
				<?php if (!empty($trip['print_columns']['Comments'])): ?>
					<tr>
						<td colspan="<?=count(get_print_columns(false, $filter));?>" class="trip-comments">
							<?=$trip['print_columns']['Comments'];?>
						</td>
					</tr>
				<?php endif; ?>
			<?php endforeach; ?>
		</tbody>
	</table>
<?php else: ?>
	<p>There are no trips to show</p>
<?php endif; ?>