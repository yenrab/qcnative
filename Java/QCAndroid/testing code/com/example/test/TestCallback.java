package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.StackCallback;

public class TestCallback implements StackCallback {

	@Override
	public void execute(HashMap<Object, Object> parameters) {
		System.out.println("all done: "+parameters);

	}

}
