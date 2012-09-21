//
//  ViewController.h
//  CoreDataExample
//
//  Created by Lee Barney on 9/21/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import <UIKit/UIKit.h>

@class QuickConnect;

@interface ViewController : UIViewController
@property (weak, nonatomic) IBOutlet UITextField *urlInput;
@property (weak, nonatomic) IBOutlet UITextField *nameInput;
@property (weak, nonatomic) IBOutlet UITextView *resultView;

@property (nonatomic,strong) QuickConnect *aQC;

- (IBAction)doHTTPRequest:(id)sender;
- (IBAction)doInsert:(id)sender;
- (IBAction)doQuery:(id)sender;

@end
