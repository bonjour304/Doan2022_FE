import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
// redux
import { filter } from 'lodash';
import { useDispatch, useSelector } from '../../redux/store';
import { deleteActionRule, getRuleList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { RuleListToolBar, RuleListHead, RuleMoreMenu } from '../../components/_dashboard/rule';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'rName', label: 'rName', alignRight: false },
  { id: 'rKey', label: 'rKey', alignRight: false },
  { id: 'rType', label: 'rType', alignRight: false },
  { id: 'rValue', label: 'rValue', alignRight: false },
  { id: 'aKey', label: 'aKey', alignRight: false },
  { id: 'aType', label: 'aType', alignRight: false },
  { id: 'aName', label: 'aName', alignRight: false }
];
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.rName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function RuleList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { rule } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('rName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getRuleList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rule.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeleteRule = (id) => {
    dispatch(deleteActionRule(id));
    dispatch(getRuleList());
  };

  const filteredUsers = applySortFilter(rule, getComparator(order, orderBy), filterName);

  return (
    <Page title="Rule: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Rule List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rule.list },
            { name: 'Rule', href: PATH_DASHBOARD.rule.list },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.rule.newRule}
              startIcon={<Icon icon={plusFill} />}
            >
              New Rule
            </Button>
          }
        />
        <Card>
          <RuleListToolBar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RuleListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={rule.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, rName, rKey, rType, rValue, aKey, aType, aName } = row;
                    return (
                      <TableRow hover key={_id} tabIndex={-1}>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {rName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{rKey}</TableCell>
                        <TableCell align="left">{rType}</TableCell>
                        <TableCell align="left">{rValue}</TableCell>
                        <TableCell align="left">{aKey}</TableCell>
                        <TableCell align="left">{aType}</TableCell>
                        <TableCell align="left">{aName}</TableCell>
                        <TableCell align="right">
                          <RuleMoreMenu onDelete={() => handleDeleteRule(_id)} ruleName={_id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rule.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
