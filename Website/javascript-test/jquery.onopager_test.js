TestCase("onoPager pager test with loop", {
  setUp: function () {
    this.pager = new onoPager.pager(
      0,
      10,
      true,
      {
        next: null,
        previous: null
      }
    );
  },

  tearDown: function () {
    delete this.pager;
  },

  "test pager is object": function () {
    assertEquals("object", typeof(this.pager));
  },

  "test initial index": function () {
    assertEquals(0, this.pager.getIndex());
  },

  "test set index": function () {
    assertEquals(8, this.pager.setIndex(8));
  },

  "test move index": function () {
    this.pager.setIndex(9)
    assertEquals(0, this.pager.move(1));
  }
});



TestCase("onoPager pager test without loop", {
  setUp: function () {
    this.pager = new onoPager.pager(
      0,
      10,
      false,
      {
        next: null,
        previous: null
      }
    );
  },

  tearDown: function () {
    delete this.pager;
  },

  "test pager is object": function () {
    assertEquals("object", typeof(this.pager));
  },

  "test initial index": function () {
    assertEquals(0, this.pager.getIndex());
  },

  "test set index": function () {
    assertEquals(8, this.pager.setIndex(8));
  },

  "test move index": function () {
    this.pager.setIndex(9)
    assertEquals(9, this.pager.move(1));
  }
});
